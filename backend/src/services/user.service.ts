import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  company: string | null;
  role: string;
  createdAt: Date;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  company?: string;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  company?: string;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      company: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: number,
  input: UpdateProfileInput
): Promise<UserProfile> {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      phone: input.phone,
      company: input.company,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      company: true,
      role: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

/**
 * Change user password
 */
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

/**
 * Create new user (Admin only)
 * Default password is 000000
 */
export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  const { email, name, company } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Default password is 000000
  const defaultPassword = '000000';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      company,
      role: 'USER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      company: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      company: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(userId: number): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}
