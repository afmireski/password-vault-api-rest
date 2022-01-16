import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { IsUuid } from '../validators/isUuid-validator';
import { NotFoundException } from '@nestjs/common';
import { userErrors } from '../error-codes/100-user-errors';
import { IsEmailValidator } from '../validators/isEmail-validator';

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
        new IsUuid('0adc9fe5-497e-4376-be4e-d7482b91bf03'),
      );

      expect(response).toMatchObject(user);
    });

    it("should return a error, because doesn't exists a user with this id", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .findUserById(new IsUuid('0adc9fe5-497e-4376-be4e-d7482b91bf04'))
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
        new IsEmailValidator('user@email.com'),
      );

      expect(response).toMatchObject(user);
    });

    it("should return a error, because doesn't exists a user with this id", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await controller
        .findUserByEmail(new IsEmailValidator('unknown@email.com'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });
  });
});
