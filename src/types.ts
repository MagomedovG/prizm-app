export type IWallet = {
  id?: number;
  logo?: string | null;
  title: string;
  prizm_wallet?: number | string;
  link?: string;
  isAdmin?:boolean;
  prizm_qr_code_url:string
};
export type ICategory = {
  id: number;
  image: string | null;
  name: string;
  items:ICategoryItemList[],
};
export type ICategoryItemList ={
  image?: string | null;
  name?: string;
  id:number,
  logo?:string,
  rating?:number,
  adress?:string,
  description?:string,
  sale?:number,
  subtitle?: string,
  feedbacks?:[]

}
export type ICategoryItem = {
  items: ICategoryItemList

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

