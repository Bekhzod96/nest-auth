import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(userRepository);
    userController = new UserController(userService);
  });

  describe('findAll', () => {
    it('should return an array of user', async () => {
      const result = ['test'];
      jest.spyOn(userService, 'findAll').mockImplementation(() => result);

      expect(await userController.findAll()).toBe(result);
    });
  });
});
