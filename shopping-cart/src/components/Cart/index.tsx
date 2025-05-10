import React, { useState, useEffect, useCallback, useRef } from 'react';
import { mockVideoCart } from '../../mocks/videos.ts';
import './styles.css';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    type: 'video' | 'photo' | 'music';
    thumbnail?: string;
}

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const cartRef = useRef(null);

    // 模拟接口请求
    useEffect(() => {
        const fetchCartData = async () => {
            const data = await mockVideoCart();
            setItems(data);
        };
        fetchCartData();
    }, []);

    // 关闭购物车逻辑
    const closeCart = useCallback(() => {
        setIsOpen(false);
    }, []);

    // 键盘事件处理
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeCart]);

    // 点击外部区域关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
                closeCart();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeCart]);

    // 购物车动画实现（参考网页[1][4]）
    const addItemAnimation = (startPosition: DOMRect) => {
        const endPosition = cartRef.current?.getBoundingClientRect();
        if (!endPosition) return;

        // 创建动画元素逻辑
        const animatedElement = document.createElement('div');
        animatedElement.style.position = 'absolute';
        animatedElement.style.left = `${startPosition.left}px`;
        animatedElement.style.top = `${startPosition.top}px`;
        document.body.appendChild(animatedElement);

        // 执行动画
        requestAnimationFrame(() => {
            animatedElement.style.transform = `translate(${endPosition.left - startPosition.left}px, ${endPosition.top - startPosition.top}px) scale(0.5)`;
            animatedElement.style.opacity = '0';
            setTimeout(() => animatedElement.remove(), 500);
        });
    };

    // 添加商品逻辑
    const handleAddItem = (item: CartItem, event) => {
        const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
        addItemAnimation(buttonRect);

        const total = items.reduce((sum, i) => sum + i.price, 0) + item.price;
        console.log('业务线:', item.type, 'ID:', item.id, '总价:', total);
        setItems(prev => [...prev, item]);
    };
    console.log(items);

    return (
        <div className="cart-container">
            <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
                🛒 购物车 ({items.length})
            </button>

            {isOpen && (
                <>
                    <div className="cart-overlay" />
                    <div className="cart-content" ref={cartRef}>
                        <button className="close-button" onClick={closeCart}>×</button>
                        <h2>购物车列表</h2>
                        <div className="items-list">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    {item.thumbnail && <img src={item.thumbnail} alt={item.title} />}
                                    <div className="item-info">
                                        <h3>{item.title}</h3>
                                        <p>¥{item.price}</p>
                                    </div>
                                    <button onClick={(e) => handleAddItem(item, e)}>+</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
