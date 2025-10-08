export interface Product{
    id:number,
    name:string,
    description:string,
    price:number,
    category:string,
    image:string,
    inCartQt:number
}
export interface Products{
 Products: Product[]
}
