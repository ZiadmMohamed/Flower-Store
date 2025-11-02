import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepo } from 'src/modules/Repositories/user.repo';
import { UpdateUserDTO } from './DTOs/users.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: jest.Mocked<UserRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepo,
          useValue: {
            findByEmail: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(UserRepo) as jest.Mocked<UserRepo>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('viewProfile', () => {
    it('should return the user found by email', async () => {
      const fakeUser = {
        _id: 'user123',
        name: 'Abd',
        email: 'abd@test.com',
      };
      userRepo.findByEmail.mockResolvedValue(fakeUser as any);

      const result = await service.viewProfile({
        email: 'abd@test.com',
      } as any);

      expect(userRepo.findByEmail).toHaveBeenCalledWith('abd@test.com');
      expect(result).toEqual(fakeUser);
    });
  });

  describe('updateProfile', () => {
    it('should call updateOne with correct args and return success message', async () => {
      const body: UpdateUserDTO = {
        name: 'New Name',
        phoneNumber: '01001234567',
      } as any;

      userRepo.updateOne.mockResolvedValue(undefined);

      const res = await service.updateProfile(
        { _id: 'user123', email: 'abd@test.com' } as any,
        body,
      );

      expect(userRepo.updateOne).toHaveBeenCalledWith({ _id: 'user123' }, body);
      expect(res).toEqual({ message: 'Profile updated successfully' });
    });

    it('should propagate errors from repository', async () => {
      const body: UpdateUserDTO = { name: 'X' } as any;
      userRepo.updateOne.mockRejectedValue(new Error('DB failure'));

      await expect(
        service.updateProfile({ _id: 'user123' } as any, body),
      ).rejects.toThrow('DB failure');

      expect(userRepo.updateOne).toHaveBeenCalledWith({ _id: 'user123' }, body);
    });
  });
});
