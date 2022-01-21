import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart")

    if (storagedCart) {
      // A variável storagedCart recebe dois tipos String e Null
      //quando ela executa e não acha dados ela retorna um array vazio
      //quando entra dados ela retorna uma string, mas o tipo do carrinho é um array de produtos
      // e para que funcione é feito um JSON.parse transformando o array em string.
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      const updatedCart = [...cart]

      const productExists = updatedCart.find(product => product.id === productId);

      // chamando a rota de estoque pasando o id 
      const stock = await api.get(`/stock/${productId}`);

      // pegando a quantidade em estoque
      const stockAmount = stock.data.amount;

    // criando uma váriavel para a quantidade atual do estoque
    // faz uma verificação se o produto existe de produtos
    // se o produto existe retorna o produto e quantidade
    // se o produto não existe retorna 0;
      const currentAmount = productExists ? productExists.amount : 0;
      // variavel para atualizar a quantidade do item 
      const amount =  currentAmount + 1;

      if(amount > stockAmount) {
        toast.error('Produto fora de estoque')
        return;
      }

      if(productExists){
        // se o produto existe, eu pego o produto e atualizo a quantidade
        productExists.amount = amount;
      }else {

        // se não existe eu vou buscar o produto na api
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }

        updatedCart.push(newProduct);
      }
      // ao final, é realizada a atualização do produto
      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
    } catch {

      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      
    } catch {
      
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      
    } catch {
      
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
