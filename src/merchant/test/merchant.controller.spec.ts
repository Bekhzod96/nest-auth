import { MerchantController } from '../merchant.controller';
import { MerchantService } from '../merchant.service';

describe('MerchantController', () => {
  let merchantController: MerchantController;
  let merchantService: MerchantService;

  beforeEach(() => {
    merchantService = new MerchantService(merchantRepository);
    merchantController = new MerchantController(merchantService);
  });

  describe('findAll', () => {
    it('should return an array of merchant', async () => {
      const result = ['test'];
      jest.spyOn(merchantService, 'findAll').mockImplementation(() => result);

      expect(await merchantController.findAll()).toBe(result);
    });
  });
});
