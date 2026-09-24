export interface ICartResponse {
    id: number,
    userId: number,
    date: string,
    products:
    {
        productId: number,
        quantity: number
    }[],
    __v: number
}