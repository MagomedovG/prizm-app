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
export interface ICategotyInBusinessInCategory  {
  id:number
  title:string
  logo: string
  cashback_size:string
} 
export interface IBusinessesInBusinessInCategory extends ICategotyInBusinessInCategory  {
  cashback_size:string
} 
export type IBusinessInCategory = {
  category: ICategotyInBusinessInCategory
  businesses: IBusinessInCategory[]
}


