export type IWallet = {
  id: number;
  qr: string | null;
  name: string;
  prizm: number;
  link: string;
};
export type ICategory = {
  id: number;
  image: string | null;
  name: string;
  item:[]
};
type IcategoryItemList ={
  image?: string | null;
  name?: string;
  id:number,
  logo?:string,
  rating?:number,
  adress?:string,
  description?:string,
  sale?:number
}
export type ICategoryItem = {
  items: IcategoryItemList

};


export const OrderStatusList: OrderStatus[] = [
  'Новый',
  'Готовится',
  'Доставляется',
  'Доставлен',
];

export type OrderStatus = 'Новый' | 'Готовится' | 'Доставляется' | 'Доставлен';



export type Profile = {
  id: string;
  group: string;
};

