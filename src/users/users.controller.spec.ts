import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { IsUuid } from '../validators/isUuid-validator';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { userErrors } from '../error-codes/100-user-errors';
import { IsEmailValidator } from '../validators/isEmail-validator';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { UpdateUserDto } from './dtos/input/update-user.dto';
import { UpdateUserPasswordDto } from './dtos/input/update-user-password.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updatePassword: jest.fn(),
    },
  };

  const user: User = {
    id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
    email: 'user@email.com',
    name: 'User',
    password: bcrypt.hashSync('123456', bcrypt.genSaltSync(10)),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const userId = (id: string) => new IsUuid(id);

  const userEmail = (email: string) => new IsEmailValidator(email);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mock,
        },
      ],
    }).compile();

    mock.user.findUnique.mockReset;
    mock.user.findFirst.mockReset;
    mock.user.create.mockReset;
    mock.user.delete.mockReset;
    mock.user.update.mockReset;
    mock.user.updatePassword.mockReset;

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a unique user', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const response = await controller.findUserById(
        userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'),
      );

      expect(response).toMatchObject(user);
    });

    it("should return a error, because doesn't exists a user with this id", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .findUserById(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a unique user', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const response = await controller.findUserByEmail(
        userEmail('user@email.com'),
      );

      expect(response).toMatchObject(user);
    });

    it("should return a error, because doesn't exists a user with this id", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .findUserByEmail(userEmail('unknown@email.com'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'user@email.com',
      name: 'User',
      password: '123456',
    };

    it('should return a new user', async () => {
      mock.user.findFirst.mockReturnValue(null);
      mock.user.create.mockReturnValue(user);
      mock.user.findUnique.mockReturnValue(user);

      await controller.create(createUserDto).then((response) => {
        expect(response).toMatchObject(user);
      });
    });

    it('should return a error, because the e-mail already is used', async () => {
      mock.user.findFirst.mockReturnValue(user);

      await controller.create(createUserDto).catch((error) => {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.response).toMatchObject({
          code: 108,
          message: userErrors[108],
        });
      });
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated_user@email.com',
    };

    const updatedUser: User = {
      id: '159db799-3d36-4ccb-8dff-f49c78ce5f28',
      email: 'updated_user@email.com',
      name: 'Updated User',
      password: user.password,
      created_at: user.created_at,
      updated_at: new Date(),
    };

    it('should return a updated user', async () => {
      mock.user.findUnique.mockReturnValue(user);
      mock.user.findFirst.mockReturnValue(null);
      mock.user.update.mockReturnValue(updatedUser);
      mock.user.findUnique.mockReturnValue(updatedUser);

      await controller
        .update(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'), updateUserDto)
        .then((response) => {
          expect(response).toMatchObject(updatedUser);
        });
    });

    it("should return a error, because the user doesn't exists", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .update(userId('0adc9fe5-497e-4376-be4e-d7482b91bf04'), updateUserDto)
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });

    it('should return a error, because the email already is used', async () => {
      mock.user.findUnique.mockReturnValue(user);
      mock.user.findFirst.mockReturnValue(user);

      await controller
        .update(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'), updateUserDto)
        .catch((error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.response).toMatchObject({
            code: 108,
            message: userErrors[108],
          });
        });
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      mock.user.findUnique.mockReturnValue(user);
      mock.user.delete.mockReturnValue(undefined);

      const response = await controller.delete(
        userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'),
      );

      expect(response).toBeUndefined;
    });

    it("should return a error, because the user doesn't exists", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .delete(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });
  });

  describe('updatePassword', () => {
    it('should return undefined, because has sucess', async () => {
      mock.user.findUnique.mockReturnValue(user);
      mock.user.update.mockReturnValue(undefined);

      const input: UpdateUserPasswordDto = {
        current_password: '123456',
        new_password: '654321',
        confirm_new_password: '654321',
      };

      const response = await controller.updatePassword(
        userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'),
        input,
      );

      expect(response).toBeUndefined();
    });

    it("should return error, because the user doesn't exists", async () => {
      mock.user.findUnique.mockReturnValue(null);

      const input: UpdateUserPasswordDto = {
        current_password: '123456',
        new_password: '654321',
        confirm_new_password: '654321',
      };

      await controller
        .updatePassword(userId('bb597c87-2cf6-47fd-9f1c-5e99a6bae93d'), input)
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });

    it('should return error, because current_password === new_password', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const input: UpdateUserPasswordDto = {
        current_password: '123456',
        new_password: '123456',
        confirm_new_password: '654321',
      };

      await controller
        .updatePassword(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'), input)
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.response).toMatchObject({
            code: 102,
            message: userErrors[102],
          });
        });
    });

    it('should return error, because new_password !== confirm_new_password', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const input: UpdateUserPasswordDto = {
        current_password: '123456',
        new_password: '654321',
        confirm_new_password: '987654',
      };

      await controller
        .updatePassword(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'), input)
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.response).toMatchObject({
            code: 103,
            message: userErrors[103],
          });
        });
    });

    it('should return error, input.current_password !== user.password', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const input: UpdateUserPasswordDto = {
        current_password: '987654',
        new_password: '654321',
        confirm_new_password: '654321',
      };

      await controller
        .updatePassword(userId('0adc9fe5-497e-4376-be4e-d7482b91bf03'), input)
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.response).toMatchObject({
            code: 104,
            message: userErrors[104],
          });
        });
    });
  });
});
