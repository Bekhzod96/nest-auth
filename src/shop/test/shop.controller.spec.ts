import { ShopController } from '../shop.controller';
import { ShopService } from '../shop.service';

describe('ShopController', () => {
  let shopController: ShopController;
  let shopService: ShopService;

  beforeEach(() => {
    shopService = new ShopService(shopRepository);
    shopController = new ShopController(shopService);
  });

  describe('findAll', () => {
    it('should return an array of shop', async () => {
      const result = ['test'];
      jest.spyOn(shopService, 'findAll').mockImplementation(() => result);

      expect(await shopController.findAll()).toBe(result);
    });
  });
});
