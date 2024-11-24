import { inject, Injectable, signal } from '@angular/core';
import { of, retry } from 'rxjs';
import {
  ICategory,
  IProduct,
  IProductResponse,
  ISubCategory,
} from '../../../products/model/product.interface';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface IAdminProductFilter {
  minPrice?: number;
  maxPrice?: number;
  itemsToShow: number;
  page?: number;
  productId?: string;
  productName?: string;
  category?: ICategory;
  subCategory?: ISubCategory;
  minDate?: any;
  maxDate?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'product';
  activeProduct = signal<IProduct | null>(null);
  productQueried = signal(false);
  productsData = of({
    totalPages: 3,
    products: [
      {
        id: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
        name: 'Autumn Chic Fashion Doll',
        description:
          "Introducing the Autumn Chic Fashion Doll, a stylish collectible that embodies sophisticated fall fashion. This beautifully crafted doll features long, wavy blonde hair styled in a retro-inspired look with soft curls and a pair of sunglasses perched atop her head. Her face is adorned with subtle yet glamorous makeup, emphasizing her striking features.\nThe doll wears an intricately designed knit dress that showcases expert craftsmanship. The dress combines deep emerald green with soft pink stripes in a unique pattern. A delicate pink rose embellishment adds a feminine touch to the shoulder. The dress's design includes interesting textures and patterns, making it a standout piece in any doll collection.\nStanding at approximately 11.5 inches tall, this doll is perfect for display or for fashion enthusiasts who appreciate miniature couture. The Autumn Chic Fashion Doll would make an excellent gift for collectors, fashion lovers, or anyone who appreciates detailed, high-quality dolls.\nPlease note that this is a collectible item intended for adult collectors and is not suitable as a toy for young children due to its delicate nature and small accessories.\\",
        image:
          'https://i.pinimg.com/564x/ce/d4/08/ced408c0b2e93e7bd1ebee5d04ef16c4.jpg',
        imageUrls: [
          'https://i.pinimg.com/564x/ce/d4/08/ced408c0b2e93e7bd1ebee5d04ef16c4.jpg',
          'https://i.pinimg.com/564x/f7/27/7d/f7277d534274f4d3989185aa783fdf4f.jpg',
          'https://i.pinimg.com/564x/95/aa/a4/95aaa411c08bef6d9721ebce66ac5d19.jpg',
          'https://i.pinimg.com/564x/14/d1/77/14d177bde0ecf6a7617dc440e9df435e.jpg',
        ],
        videoUrls: [],
        price: 5999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 5,
        categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
        subCategoryId: 'd4c97084-52c0-42e6-b3d4-a931960a3432',
        createdAt: '2024-10-18T19:49:04.915Z',
        updateAt: '2024-11-12T12:20:32.910Z',
        category: {
          id: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          name: 'Dolls & Plush Toys',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        subCategory: {
          id: 'd4c97084-52c0-42e6-b3d4-a931960a3432',
          name: 'Fashion Dolls',
          categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        ratings: [
          {
            id: '171d68d1-11c9-4337-a18f-8e39cd881656',
            rating: 5,
            title: 'Nice doll',
            comment: null,
            createdAt: '2024-11-10T17:59:55.313Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: '3760ffb0-9d1d-49b8-b7df-bbf9f4513250',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: '7c839780-92b0-4fcd-a2f3-9e19449c751a',
            rating: 5,
            title: 'Perfect figure for my daughter',
            comment: 'She loves it. Good toy.',
            createdAt: '2024-11-09T11:50:02.554Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: '729042e1-751c-4781-ab41-794dfbdd1083',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: 'ea47cc08-d47a-45b6-9ca6-4019a14819bd',
            rating: 3,
            title: 'Not impressed',
            comment:
              'My daughter had her hopes too high on this one. She was a little disappointed.',
            createdAt: '2024-11-03T17:32:53.447Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: 'c27c0888-e11b-4961-a895-c2c0639fd0dd',
            userId: 'de731f59-ba79-43b9-8edf-b7058378de05',
            user: {
              id: 'de731f59-ba79-43b9-8edf-b7058378de05',
              email: 'hey1@hey.hey',
              name: 'John Payne',
              phoneNumber: '081067103242',
              createdAt: '2024-10-15T15:57:41.941Z',
              updateAt: '2024-11-03T14:06:38.676Z',
            },
          },
          {
            id: '8a3a7d9c-4382-4c41-96f7-b29875deec84',
            rating: 5,
            title: 'Nice doll',
            comment:
              "I was really impressed with this doll! It's well-crafted and has such a charming design—perfect for both kids and collectors.",
            createdAt: '2024-11-03T13:45:54.498Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: 'cf6493f9-ec46-4596-bd89-7c9fe3294bb7',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: '64663d7c-88ff-49a8-919b-c5a6f780e332',
            rating: 3,
            title: 'Its okay',
            comment: null,
            createdAt: '2024-10-30T15:33:34.226Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: '88018950-f342-481f-822f-d2d4b34ee917',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: '64824454-3cb3-4bac-9b43-08fcdada5660',
            rating: 4,
            title: 'Perfect!',
            comment:
              "My daughter loves it so much. She wouldn't let go of it ever since she got it",
            createdAt: '2024-10-30T15:28:07.048Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: '6d63b380-314f-4f60-a63c-3b1e564033cb',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: '1b676116-ceba-40c1-8289-4b8fec93416e',
            rating: 4,
            title: 'Loved it!',
            comment: "It's good.",
            createdAt: '2024-10-30T15:25:03.691Z',
            productId: '0398ebc0-3788-4424-b8c7-3b7259ae6b38',
            orderItemId: '426f6d1f-c7c3-4912-b92e-469479cf0c90',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '1657455f-3fe8-4b54-aea2-3a42d8694328',
        name: 'Gerry the Wildlife Ambassador Bear',
        description:
          "Meet Gerry, the cuddly brown teddy bear with a passion for wildlife conservation! This soft and huggable plush toy comes with a special golden card featuring a stylish giraffe silhouette and the word 'WILDLIFE'. Gerry is not just a comforting companion, but also an educational tool to spark conversations about animal preservation and the beauty of nature. Made with high-quality, plush materials, Gerry has endearing features including button eyes and a friendly smile. Perfect for children and adults alike who love animals and want to support wildlife awareness. Gerry measures approximately 12 inches tall, making him the ideal size for snuggling or displaying proudly on a shelf. Bring home Gerry today and join him on his mission to protect and celebrate our planet's amazing wildlife!",
        image:
          'https://img.freepik.com/free-photo/teddy-bear-toy-held-by-hand-kids_53876-128997.jpg?t=st=1729278620~exp=1729282220~hmac=dad7cb0f462a4feb496fa6bbe7d10b25ae0f136937d1902d71775fd299d4ba1b&w=740',
        imageUrls: [
          'https://img.freepik.com/free-photo/teddy-bear-toy-held-by-hand-kids_53876-128997.jpg?t=st=1729278620~exp=1729282220~hmac=dad7cb0f462a4feb496fa6bbe7d10b25ae0f136937d1902d71775fd299d4ba1b&w=740',
          'https://img.freepik.com/free-photo/teddy-bear-held-by-hand-charity-campaign_53876-129018.jpg?t=st=1729278676~exp=1729282276~hmac=76464f51fa70ce722fba53a8cd6ca1d2c1386e5d241a2092a4d2057fd1445ac1&w=996',
          'https://img.freepik.com/free-photo/animal-wildlife-word-with-giraffe-graphic_53876-138502.jpg?t=st=1729278703~exp=1729282303~hmac=42a49a4ac9a3e0f87b3afa8d82de85e8ffdaeb365011f091e1a7e69d07d812d7&w=740',
        ],
        videoUrls: [],
        price: 1299,
        previousPrice: 0,
        isSoldOut: false,
        unit: 8,
        categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
        subCategoryId: '1985f8e6-7df6-4364-81ef-5c3dfdd00c31',
        createdAt: '2024-10-18T19:19:11.737Z',
        updateAt: '2024-11-10T14:37:31.292Z',
        category: {
          id: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          name: 'Dolls & Plush Toys',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        subCategory: {
          id: '1985f8e6-7df6-4364-81ef-5c3dfdd00c31',
          name: 'Stuffed Animals',
          categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        ratings: [
          {
            id: '84e74d2b-1bb3-4fe7-b36f-f37036f7a47f',
            rating: 3,
            title: 'Its small but good quality',
            comment: null,
            createdAt: '2024-10-30T15:33:58.946Z',
            productId: '1657455f-3fe8-4b54-aea2-3a42d8694328',
            orderItemId: '495b0e0a-eea3-4aad-a941-08cb9bdc454c',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '28323ea3-38f4-4e3a-8ff5-cd5acdf049c1',
        name: 'Jessie Action Figure',
        description:
          'Bring home the cowgirl charm of the Wild West with the Jessie Interactive Talking Action Figure from Toy Story! Standing at approximately 12 inches tall, Jessie is dressed in her classic red cowgirl hat, yellow-trimmed white blouse, and blue denim-style pants with cow-print chaps, just like in the films. This figure features fully poseable limbs for dynamic play and comes with interactive talking features. Pull her string, and she’ll say a variety of fun phrases straight from Toy Story, including her famous "Yodel-ay-hee-hoo!" Her friendly smile and detailed facial expressions capture her spirited personality, making this Jessie figure a must-have for any Toy Story fan. Perfect for both playtime and display, Jessie is always ready for new adventures with her fellow toys!',
        image:
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417138156378?fmt=webp&qlt=70&wid=652&hei=652',
        imageUrls: [
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417138156378?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417138156378-4?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417138156378-3?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417138156378-6?fmt=webp&qlt=70&wid=652&hei=652',
        ],
        videoUrls: [],
        price: 38999,
        previousPrice: 40000,
        isSoldOut: false,
        unit: 15,
        categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
        subCategoryId: '1eb162ea-d8bd-4a3f-84d8-fa9114cb96df',
        createdAt: '2024-10-19T15:10:20.547Z',
        updateAt: '2024-11-10T14:28:25.642Z',
        category: {
          id: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          name: 'Action Figures',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        subCategory: {
          id: '1eb162ea-d8bd-4a3f-84d8-fa9114cb96df',
          name: 'Movie Characters',
          categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        ratings: [
          {
            id: 'eb58a9d5-e3fe-471e-8c95-e3b858e6f4d7',
            rating: 5,
            title: 'Perfect figure!',
            comment: 'It fits well into my workspace. ',
            createdAt: '2024-11-09T11:43:13.898Z',
            productId: '28323ea3-38f4-4e3a-8ff5-cd5acdf049c1',
            orderItemId: 'b9d579d4-a0da-4171-b888-8e521fa05570',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: 'aeae6ddb-c223-4ce0-9021-5e7434c4de2f',
            rating: 5,
            title: 'Looks okay',
            comment: 'I like it',
            createdAt: '2024-10-30T18:40:02.165Z',
            productId: '28323ea3-38f4-4e3a-8ff5-cd5acdf049c1',
            orderItemId: 'bbdc806a-0598-4edb-b37a-0fa946e7c173',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: '2e022d79-56ad-4726-a0ba-0f2d4b01cb5a',
            rating: 2,
            title: 'Small',
            comment: 'Looks too small.',
            createdAt: '2024-10-30T15:25:49.034Z',
            productId: '28323ea3-38f4-4e3a-8ff5-cd5acdf049c1',
            orderItemId: 'b104264b-f499-435b-9287-be3b2e37c626',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '30690fb5-d68b-4038-b156-2973dc1b058b',
        name: 'Rechargeable Remote Controlled Toy Car',
        description:
          "Experience high-speed fun with this Rechargeable Remote Controlled Toy Car! Designed for kids and adults alike, this sleek and stylish RC car features a durable body and vibrant colors that catch the eye. Equipped with a powerful rechargeable battery, it provides extended playtime without the hassle of constantly replacing batteries. The intuitive remote control offers easy maneuverability, allowing for sharp turns, speedy straightaways, and exciting stunts.\n\nThis toy car can reach impressive speeds and navigate various terrains, from smooth indoor surfaces to outdoor tracks. With its responsive controls, users can perform drifts, spins, and jumps, enhancing the thrill of every race.\n\nPerfect for both solo play and competitive racing with friends, this rechargeable remote-controlled car is an excellent gift for aspiring racers and a fantastic addition to any toy collection! Whether you're zooming around the backyard or navigating obstacle courses, this RC car guarantees hours of entertainment.",
        image:
          'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/46/7226113/1.jpg?8243',
        imageUrls: [
          'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/46/7226113/1.jpg?8243',
          'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/46/7226113/3.jpg?5593',
          'https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/46/7226113/5.jpg?5593',
        ],
        videoUrls: [],
        price: 13999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 11,
        categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
        subCategoryId: '7e461302-e977-435a-9fcc-7a40b3d96a85',
        createdAt: '2024-10-19T15:50:26.767Z',
        updateAt: '2024-11-09T21:17:24.295Z',
        category: {
          id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          name: 'Vehicles & Remote Controlled Toys',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        subCategory: {
          id: '7e461302-e977-435a-9fcc-7a40b3d96a85',
          name: 'Cars & Trucks',
          categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        ratings: [
          {
            id: '16cbb84d-407e-4726-bb5d-169e361995f9',
            rating: 4,
            title: 'Its a nice one',
            comment:
              'Although its small, its a joy to play with. The battery lasts so long as well.',
            createdAt: '2024-11-09T13:26:33.854Z',
            productId: '30690fb5-d68b-4038-b156-2973dc1b058b',
            orderItemId: '7a1b59b1-1343-4fd3-8fd5-3f2788c9f476',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
          {
            id: 'ccc6e17b-1eb4-44a7-be87-a6c123859304',
            rating: 3,
            title: 'Smaller than it looks',
            comment: 'It serves its purpose though',
            createdAt: '2024-10-30T18:41:14.931Z',
            productId: '30690fb5-d68b-4038-b156-2973dc1b058b',
            orderItemId: 'cca7e0c6-79f9-457a-991c-e5e252a5a133',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '316e1a7d-a2b1-4415-98d3-62b19e6aeeea',
        name: 'Trailer Truck with Free Wheel Bulldozer',
        description:
          'Get ready for action with the Trailer Truck with Free Wheel Bulldozer! This exciting playset features a durable trailer truck designed for imaginative play, complete with a free-wheeling bulldozer that can be easily loaded and unloaded. The truck boasts vibrant colors and realistic detailing, making it an eye-catching addition to any toy collection. Kids can navigate through construction sites, haul materials, and create their own adventure scenarios. The free-wheeling bulldozer has functional moving parts, allowing little ones to dig and push with ease. Ideal for indoor or outdoor play, this set encourages creativity, fine motor skills, and cooperative play. Perfect for young construction enthusiasts, the Trailer Truck with Free Wheel Bulldozer is sure to provide hours of entertainment!',
        image:
          'https://silverlit.com/wp-content/uploads/2022/05/pdt_pic_81487_v0.jpg',
        imageUrls: [
          'https://silverlit.com/wp-content/uploads/2022/05/pdt_pic_81487_v0.jpg',
          'https://silverlit.com/wp-content/uploads/2022/05/pdt_pic_81487bulldozer_v01.jpg',
          'https://silverlit.com/wp-content/uploads/2022/05/pdt_pic_81487trailer_v01.jpg',
          'https://silverlit.com/wp-content/uploads/2022/05/pdt_pic_81487tx_v01.jpg',
        ],
        videoUrls: [],
        price: 17499,
        previousPrice: 0,
        isSoldOut: false,
        unit: 5,
        categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
        subCategoryId: '7e461302-e977-435a-9fcc-7a40b3d96a85',
        createdAt: '2024-10-19T15:59:49.964Z',
        updateAt: '2024-11-12T12:20:33.491Z',
        category: {
          id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          name: 'Vehicles & Remote Controlled Toys',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        subCategory: {
          id: '7e461302-e977-435a-9fcc-7a40b3d96a85',
          name: 'Cars & Trucks',
          categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        ratings: [
          {
            id: 'ecfe477e-adf0-4722-a117-d3d6d574c259',
            rating: 5,
            title: 'Good',
            comment: null,
            createdAt: '2024-11-10T19:51:02.879Z',
            productId: '316e1a7d-a2b1-4415-98d3-62b19e6aeeea',
            orderItemId: '04aea073-f07b-4989-b82b-a06e4b6f02e4',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '507da05f-b72b-47a5-9226-0473746033d3',
        name: 'Gorgon 4X2 Mega 550 Brushed Monster Truck RTR',
        description:
          'Unleash the power of the Gorgon 4X2 Mega 550 Brushed Monster Truck RTR! This ready-to-run (RTR) monster truck is designed for thrill-seekers and RC enthusiasts who crave high-octane action. Powered by a robust brushed motor, this truck delivers impressive speed and torque, making it perfect for tackling rough terrains and conquering obstacles with ease.\n\nThe 4X2 drivetrain ensures great control and maneuverability, allowing you to navigate through dirt, grass, and gravel effortlessly. Its durable construction and large, rugged tires provide excellent traction and stability, making it ideal for outdoor adventures. The Gorgon features an eye-catching design with vibrant colors and bold graphics that stand out during play.\n\nThis package is ready to roll straight out of the box, offering convenience and excitement for both beginners and experienced drivers. Get ready to take your RC experience to the next level with the Gorgon 4X2 Mega 550 Monster Truck!',
        image:
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw91f4aeb6/Images/ARA/ARA3230ST1_A21_L9L5UTCD.jpg?sw=800&sh=800&sm=fit',
        imageUrls: [
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw91f4aeb6/Images/ARA/ARA3230ST1_A21_L9L5UTCD.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw128aca1b/Images/ARA/ARA3230ST1_A4_L9L5UTCD.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw7ec524bd/Images/ARA/ARA3230ST1_A2_L9L5UTCD.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dwb4c8405c/Images/ARA/ARA3230ST1_A3_L9L5UTCD.jpg?sw=800&sh=800&sm=fit',
        ],
        videoUrls: [],
        price: 817499,
        previousPrice: 0,
        isSoldOut: false,
        unit: 7,
        categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
        subCategoryId: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
        createdAt: '2024-10-19T16:10:14.114Z',
        updateAt: '2024-11-12T12:20:33.639Z',
        category: {
          id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          name: 'Vehicles & Remote Controlled Toys',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        subCategory: {
          id: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
          name: 'RC Cars',
          categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        ratings: [],
      },
      {
        id: '6d349ae8-5ab8-4516-a4da-701addf7dc03',
        name: 'Activity Truck',
        description:
          'Introduce your little one to a world of fun and learning with the My First Activity Truck! This engaging toy truck is designed for toddlers and features a variety of interactive elements that stimulate curiosity and encourage developmental skills. The truck is brightly colored, capturing the attention of young children and promoting imaginative play.',
        image:
          'https://silverlit.com/wp-content/uploads/2022/12/81478_2-2048x2048.jpg',
        imageUrls: [
          'https://silverlit.com/wp-content/uploads/2022/12/81478_2-2048x2048.jpg',
          'https://silverlit.com/wp-content/uploads/2022/12/81478_5-2048x2048.jpg',
          'https://silverlit.com/wp-content/uploads/2022/12/81478_3-2048x2048.jpg',
          'https://silverlit.com/wp-content/uploads/2022/12/81478_8.jpg',
        ],
        videoUrls: [],
        price: 11999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 4,
        categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
        subCategoryId: '7e461302-e977-435a-9fcc-7a40b3d96a85',
        createdAt: '2024-10-19T15:56:49.437Z',
        updateAt: '2024-11-10T20:47:09.583Z',
        category: {
          id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          name: 'Vehicles & Remote Controlled Toys',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        subCategory: {
          id: '7e461302-e977-435a-9fcc-7a40b3d96a85',
          name: 'Cars & Trucks',
          categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        ratings: [],
      },
      {
        id: '7998d8e8-f42b-428c-8d79-94b33a2ba445',
        name: 'Fluffy Friends Penguin Plush',
        description:
          'Adorable and huggable penguin plush toy. Made with soft, high-quality materials, this 12-inch tall penguin is perfect for cuddling and playtime. Suitable for all ages.',
        image:
          'https://img.freepik.com/free-photo/one-teddy-bear-hugs-another_144627-15245.jpg?t=st=1729276462~exp=1729280062~hmac=6e806944678e53fabd472fda9a6fae7921317ac33d4935c84ecd9d5c7ed59528&w=740',
        imageUrls: [
          'https://img.freepik.com/free-photo/one-teddy-bear-hugs-another_144627-15245.jpg?t=st=1729276462~exp=1729280062~hmac=6e806944678e53fabd472fda9a6fae7921317ac33d4935c84ecd9d5c7ed59528&w=740',
          'https://img.freepik.com/free-photo/cute-teddy-bear_144627-15244.jpg?t=st=1729276636~exp=1729280236~hmac=3b323b9666bc9259a12f72bcc9bcc49c0d114211b94771f198eb2e3776c24c06&w=996',
          'https://img.freepik.com/free-photo/cute-teddy-bear_144627-15357.jpg?t=st=1729276672~exp=1729280272~hmac=cb6509e8907eadca971f6ca26a2504b021b3a1cc2bba2962ae24042d37cfffc6&w=740',
          'https://img.freepik.com/free-photo/cute-teddy-bear_144627-15242.jpg?t=st=1729276746~exp=1729280346~hmac=2bfe68e43bc1766c991589ea34308847734b0b0727504544fbb58c03cfca7648&w=826',
        ],
        videoUrls: [],
        price: 2499,
        previousPrice: 2999,
        isSoldOut: true,
        unit: 0,
        categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
        subCategoryId: '1985f8e6-7df6-4364-81ef-5c3dfdd00c31',
        createdAt: '2024-10-18T18:58:25.109Z',
        updateAt: '2024-11-09T21:33:26.293Z',
        category: {
          id: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          name: 'Dolls & Plush Toys',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        subCategory: {
          id: '1985f8e6-7df6-4364-81ef-5c3dfdd00c31',
          name: 'Stuffed Animals',
          categoryId: 'c7feff28-5de1-4c55-bd28-29c333541a8a',
          createdAt: '2024-10-18T16:34:46.426Z',
          updateAt: '2024-10-18T16:34:46.426Z',
        },
        ratings: [
          {
            id: 'da9b763e-c4af-446e-be66-4df91339d7f7',
            rating: 5,
            title: 'Fluffy!',
            comment: 'I love it',
            createdAt: '2024-10-30T15:26:26.331Z',
            productId: '7998d8e8-f42b-428c-8d79-94b33a2ba445',
            orderItemId: '833dd491-7dde-4e6b-82a4-31dad8504ff1',
            userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
            user: {
              id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
              email: 'hey@hey.hey',
              name: 'Anon Wise',
              phoneNumber: '+2548102710372',
              createdAt: '2024-10-15T15:26:57.543Z',
              updateAt: '2024-11-09T11:48:54.890Z',
            },
          },
        ],
      },
      {
        id: '7a8168cb-1d3c-4c59-90f4-9c9604f57516',
        name: 'Mojave Grom Mega 380 Brushed 4X4 Small Scale Desert Truck RTR',
        description:
          'Experience thrilling off-road adventures with the Mojave Grom Mega 380 Brushed 4X4 Small Scale Desert Truck RTR! This ready-to-run (RTR) truck is designed for both novice and experienced RC enthusiasts, featuring a robust brushed motor that delivers impressive speed and performance on various terrains. The 4X4 drivetrain ensures excellent traction and stability, making it perfect for conquering sandy dunes and rugged landscapes.\n\nThe compact size allows for easy maneuverability while still providing the durability needed for tough outdoor play. This package includes a rechargeable battery and charger, so you can start racing right away. With its striking design and vibrant colors, the Mojave Grom Mega 380 not only looks great but is built to withstand the rigors of off-road racing. Get ready to hit the trails and enjoy hours of excitement with this dynamic desert truck!',
        image:
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dwbf5e69a9/Images/ARA/ARA2104T1_A0_65K78UMI.jpg?sw=800&sh=800&sm=fit',
        imageUrls: [
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dwbf5e69a9/Images/ARA/ARA2104T1_A0_65K78UMI.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw31f536dd/Images/ARA/ARA2104T1_A18_65K78UMI.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dwb5c3ee50/Images/ARA/ARA2104T1_A17_65K78UMI.jpg?sw=800&sh=800&sm=fit',
          'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw2333cdcc/Images/ARA/ARA2104T1_A19_65K78UMI.jpg?sw=800&sh=800&sm=fit',
        ],
        videoUrls: [],
        price: 617499,
        previousPrice: 0,
        isSoldOut: false,
        unit: 7,
        categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
        subCategoryId: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
        createdAt: '2024-10-19T16:06:31.405Z',
        updateAt: '2024-11-10T14:38:04.812Z',
        category: {
          id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          name: 'Vehicles & Remote Controlled Toys',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        subCategory: {
          id: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
          name: 'RC Cars',
          categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
          createdAt: '2024-10-19T14:48:27.470Z',
          updateAt: '2024-10-19T14:48:27.470Z',
        },
        ratings: [],
      },
      {
        id: '8b926a36-f799-44de-9f82-fddcfba66190',
        name: 'Spider-Man Action Figure – Marvel',
        description:
          'Swing into action with this Spider-Man Action Figure, inspired by Marvel’s friendly neighborhood superhero! Standing at approximately 12 inches tall, this figure features the classic red and blue spider suit, complete with intricate web detailing and the iconic black spider emblem on his chest. Spider-Man is highly poseable, with multiple points of articulation that allow for dynamic action poses and web-slinging adventures. Whether scaling walls, fighting villains, or leaping into heroic stances, this figure captures the agility and acrobatic abilities of the web-slinger. Perfect for both play and display, this Spider-Man action figure is a must-have for fans who want to recreate their favorite moments from the Marvel universe and help Spidey save the day!',
        image:
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461012491185?fmt=webp&qlt=70&wid=652&hei=652',
        imageUrls: [
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461012491185?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461012491185-2?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461012491185-3?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461012491185-4?fmt=webp&qlt=70&wid=652&hei=652',
        ],
        videoUrls: [],
        price: 32999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 49,
        categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
        subCategoryId: '63291e07-1f47-401b-9744-db989d27cef0',
        createdAt: '2024-10-19T15:23:39.453Z',
        updateAt: '2024-11-10T14:27:34.589Z',
        category: {
          id: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          name: 'Action Figures',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        subCategory: {
          id: '63291e07-1f47-401b-9744-db989d27cef0',
          name: 'Superheroes',
          categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        ratings: [],
      },
      {
        id: 'ac5841f6-60c2-4aea-99c4-5d36f9657317',
        name: 'Miles Morales Spider-Man Action Figure – Marvel',
        description:
          "Swing into the multiverse with this Miles Morales Spider-Man Action Figure! Standing at approximately 6 inches tall, this figure captures the unique style of Miles, featuring his iconic black and red spider suit with a striking large red spider emblem across his chest. The figure boasts multiple points of articulation, allowing for dynamic poses that showcase Miles' acrobatic skills and agility. With a detailed sculpt and vibrant colors, this action figure perfectly embodies the essence of the young hero who takes on the mantle of Spider-Man. Complete with additional accessories like web-shooters and interchangeable hands, this Miles Morales figure is perfect for both play and display, making it a must-have for fans of the Spider-Verse and Marvel enthusiasts alike!",
        image:
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417137567243?fmt=webp&qlt=70&wid=652&hei=652',
        imageUrls: [
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417137567243?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417137567243-1?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417137567243-2?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/417137567243-4?fmt=webp&qlt=70&wid=652&hei=652',
        ],
        videoUrls: [],
        price: 23999,
        previousPrice: 26999,
        isSoldOut: false,
        unit: 8,
        categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
        subCategoryId: '63291e07-1f47-401b-9744-db989d27cef0',
        createdAt: '2024-10-19T15:39:42.036Z',
        updateAt: '2024-11-10T14:27:53.214Z',
        category: {
          id: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          name: 'Action Figures',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        subCategory: {
          id: '63291e07-1f47-401b-9744-db989d27cef0',
          name: 'Superheroes',
          categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        ratings: [],
      },
      {
        id: 'b1e25c31-21da-48fc-bdb7-a00113d2cc74',
        name: 'Hulk Action Figure – Marvel',
        description:
          "Smash into action with this Hulk Action Figure, inspired by Marvel's incredible superhero! Standing at an impressive 12 inches tall, this figure showcases the Hulk’s signature green skin, massive muscles, and fierce facial expression that captures his powerful persona. With multiple points of articulation, the Hulk can be posed in a variety of dynamic stances, perfect for recreating his most epic battles. This figure features detailed sculpting, including his iconic tattered purple shorts, and is designed to withstand any display or playtime challenges. Whether he's taking on the toughest villains or standing proud in your Marvel collection, this Hulk action figure embodies the sheer strength and might of the legendary character, making it a must-have for fans of all ages!",
        image:
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461013120497?fmt=webp&qlt=70&wid=652&hei=652',
        imageUrls: [
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461013120497?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461013120497-1?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461013120497-3?fmt=webp&qlt=70&wid=652&hei=652',
          'https://cdn.s7.shopdisney.eu/is/image/DisneyStoreES/461013120497-5?fmt=webp&qlt=70&wid=652&hei=652',
        ],
        videoUrls: [],
        price: 38999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 47,
        categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
        subCategoryId: '63291e07-1f47-401b-9744-db989d27cef0',
        createdAt: '2024-10-19T15:26:23.458Z',
        updateAt: '2024-10-19T15:26:23.458Z',
        category: {
          id: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          name: 'Action Figures',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        subCategory: {
          id: '63291e07-1f47-401b-9744-db989d27cef0',
          name: 'Superheroes',
          categoryId: 'b74b586a-59bf-428a-8c60-14ffd0b7608a',
          createdAt: '2024-10-19T15:05:03.719Z',
          updateAt: '2024-10-19T15:05:03.719Z',
        },
        ratings: [],
      },
    ],
  });

  constructor() {}

  getProducts(filters: IAdminProductFilter) {
    let params = new HttpParams();

    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
      this.productQueried.set(true);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
      this.productQueried.set(true);
    }
    if (filters?.category) {
      params = params.set('deliveryStatus', filters.category.id);
      this.productQueried.set(true);
    }
    if (filters?.page) {
      params = params.set('page', filters.page);
    }
    if (filters?.itemsToShow) {
      params = params.set('pageSize', filters.itemsToShow);
    }
    if (filters?.subCategory) {
      params = params.set('orderId', filters.subCategory.id);
      this.productQueried.set(true);
    }
    if (filters?.minDate) {
      params = params.set('minDate', filters.minDate);
      this.productQueried.set(true);
    }
    if (filters?.maxDate) {
      params = params.set('maxDate', filters.maxDate);
      this.productQueried.set(true);
    }

    return this.http
      .get<IProductResponse>(`${this.apiUrl}/all`, { params })
      .pipe(retry(3));
  }

  formatDate(date: Date) {
    return new Date(date).toISOString();
  }

  formatDateToLocale(date: Date) {
    return new Date(date);
  }
}
