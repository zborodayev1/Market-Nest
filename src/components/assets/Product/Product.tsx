import React from 'react'

interface User {
  id: string
  // fullName: string
  // address: string
  // city: string
  // country: string
  // phone: string
}

interface Product {
  _id: number
  text: string
  tags: Array<string>
  price: string
  viewsCount: number
  createdAt: string
  image: any
  user: User
}

interface ProductProps {
  product: Product
}

export const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div>
      <h2>{product.text}</h2>
      <p>Price: ${product.price}</p>
      <p>Views: {product.viewsCount}</p>
      {/* <p>User: {product.user.fullName}</p> */}
      <img src={product.image} alt={product.text} />
    </div>
  )
}
