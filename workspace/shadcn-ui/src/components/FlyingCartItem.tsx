import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function FlyingCartItem() {
  const flyingItem = useCart(state => state.flyingItem);

  useEffect(() => {
    if (flyingItem) {
      const flyingElement = document.getElementById('flying-cart-item');
      if (flyingElement) {
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
          const cartRect = cartButton.getBoundingClientRect();
          flyingElement.style.left = `${flyingItem.startX - 25}px`;
          flyingElement.style.top = `${flyingItem.startY - 25}px`;
          
          // Animate to cart
          setTimeout(() => {
            flyingElement.style.left = `${cartRect.left + cartRect.width / 2 - 25}px`;
            flyingElement.style.top = `${cartRect.top + cartRect.height / 2 - 25}px`;
            flyingElement.style.transform = 'scale(0)';
            flyingElement.style.opacity = '0';
          }, 50);
        }
      }
    }
  }, [flyingItem]);

  if (!flyingItem) return null;

  return (
    <div
      id="flying-cart-item"
      className="fixed w-12 h-12 z-[9999] pointer-events-none transition-all duration-700 ease-out"
      style={{
        left: flyingItem.startX - 25,
        top: flyingItem.startY - 25,
      }}
    >
      <img
        src={flyingItem.image}
        alt="Flying item"
        className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-green-500"
      />
    </div>
  );
}