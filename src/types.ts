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
} 
export interface IBusinessesInBusinessInCategory extends ICategotyInBusinessInCategory {
  cashback_size:string
} 
export interface IBusinessInCategory {
  category: ICategotyInBusinessInCategory
  businesses: IBusinessInCategory[]
}
export type IBusiness = {
  id:number
  title:string
  logo: string
  description:string
  short_description:string
  created_by:number
  cashback_size:string
  address:string
  images:any
  ratings_number:number
  average_rating:any
  map_url:string
  category: ICategotyInBusinessInCategory
}
export type IFeedbacks = {
  id:number
  created_at:any
  created_by:any
  text:string
}
export type IFund = {
  id:number
  title:string
  logo:string
  username?:string
  prizm_wallet:string
  prizm_qr_code_url:string
  is_superuser?:boolean
  prizm_public_key?:string 
}

