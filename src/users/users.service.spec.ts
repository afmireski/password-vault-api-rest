import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Console } from 'console';
import { userErrors } from '../error-codes/100-user-errors';
import { ErrorCodeDto } from '../error-codes/error-code.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updatePassword: jest.fn(),
    },
  };

  const user = {
    id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
    email: 'user@email.com',
    name: 'User',
    password: bcrypt.hashSync('123456', bcrypt.genSaltSync(10)),
    created_at: '2022-01-03T13:31:42.730Z',
    updated_at: '2022-01-03T13:31:42.730Z',
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mock,
        },
      ],
    }).compile();

    mock.user.findUnique.mockReset;
    mock.user.create.mockReset;
    mock.user.delete.mockReset;
    mock.user.update.mockReset;
    mock.user.updatePassword.mockReset;

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUnique', () => {
    it('should find a unique user (id)', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const response = await service.findUnique({
        id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
      });

      expect(response).toMatchObject(user);
    });

    it('should find a unique user (email)', async () => {
      mock.user.findUnique.mockReturnValue(user);

      const response = await service.findUnique({
        email: 'user@email.com',
      });

      expect(response).toMatchObject(user);
    });

    it("should return a error because doesn't exists a user with this id", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await service
        .findUnique({
          id: 'bb597c87-2cf6-47fd-9f1c-5e99a6bae93d',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.response).toMatchObject({
            code: 101,
            message: userErrors[101],
          });
        });
    });

    it("should return a error because doesn't exists a user with this email", async () => {
      mock.user.findUnique.mockReturnValue(null);

      await service
        .findUnique({
          email: 'unknown@email.com',
        })
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
