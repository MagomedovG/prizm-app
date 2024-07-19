import {IWallet} from "@/src/types";

const wallets:IWallet[] = [
        {
            id: 1,
            name: 'Мой кошелек',
            qr: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg',
            prizm: 'PRIZM- 12312312-12312312-1231',
            link:'https://example.com',
            isAdmin:true
        },
        {
            id: 2,
            name: 'Фонд 1',
            qr: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg',
            prizm: 'PRIZM- 12312312-12312312-1231',
            link:'https://example.com'
        },
        {
            id: 3,
            name: 'Фонд 2',
            qr: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg',
            prizm: 'PRIZM- 12312312-12312312-1231',
            link:'https://example.com',
        },
        {
            id: 4,
            name: 'Фонд 1',
            qr: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg',
            prizm: 'PRIZM- 12312312-12312312-1231',
            link:'https://example.com',
        },
        {
            id: 5,
            name: 'Фонд 1',
            qr: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg',
            prizm: 'PRIZM- 12312312-12312312-1231',
            link:'https://example.com',
        },
    ];
export const defaultQr = 'https://optim.tildacdn.pub/tild3631-3538-4965-a435-623461383764/-/cover/720x792/center/center/-/format/webp/_.jpg'
// export default defaultImage

export default wallets;
