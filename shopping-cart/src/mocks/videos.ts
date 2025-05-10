import { CartItem } from '../components/Cart';

export const mockVideoCart = () => {
    return new Promise<CartItem[]>((resolve) => {
      setTimeout(() => resolve([
        {
          id: 'v001',
          title: '拜年EDIUS模板',
          price: 30,
          type: 'video',
          thumbnail: ''
        }
      ]), 500);
    });
  };
  