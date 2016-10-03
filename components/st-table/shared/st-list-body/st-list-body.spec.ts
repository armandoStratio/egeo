import {GosecListBodyComponent} from './';
import { Model } from '../'
import { FieldsMetadata, ORDER_TYPE, DataList, Order, GosecListHeaderComponent, GosecListRowComponent } from '../';

class Hero extends Model<heroeInterface> {

   constructor(data: heroeInterface) {
      super(data);
   };

   getValue(key: string): string {
      return this.toString(this.data[key]);
   }

   createModel(data: heroeInterface): Model<heroeInterface> {
      return new Hero(data);
   }

   compare(b: Model<heroeInterface>, order: Order): number {
      let comparation: number;
      comparation = this.compareNumbersAndString(this.data[order.orderBy], b.data[order.orderBy]);
      return order.type === ORDER_TYPE.ASC ? comparation : (comparation * -1);
   }

   clone(): Hero {
      return new Hero(_.clone(this.data));
   }

   private compareNumbersAndString(a: string | number, b: string | number): number {
      a = typeof a === 'string' ? a.toUpperCase() : a;
      b = typeof b === 'string' ? b.toUpperCase() : b;

      if (a < b) {
         return -1;
      } else if (a > b) {
         return 1;
      } else {
         return 0;
      }
   }

   private toString(value: any): string {
      if (value !== undefined) {
         return value.toString();
      } else {
         return '';
      }
   }
} //end class Hero

interface heroeInterface {
   name: string,
   city: string,
   age: number,
   magician: number,
   alive: boolean
}

let heroes: Array<heroeInterface> = [
   { name: 'Caramon Majere', 'city': 'Solamnia', age: 22, 'magician': 0, 'alive': false },
   { name: 'Raistlin Majere', 'city': 'Istar', age: 984, 'magician': 1, 'alive': true },
   { name: 'Alhana Starbreeze', 'city': 'Qualinesti', age: 18, 'magician': 0, 'alive': false },
   { name: 'Dalamar', 'city': 'Icereach', age: 30, 'magician': 0, 'alive': true },
   { name: 'Riverwind', 'city': 'Ergoth', age: 22, 'magician': 0, 'alive': true }
];

let heroesMetadata = [
   { id: 'name', label: 'Name', type: 'text', link: false },
   {
      id: 'city',
      label: 'City',
      type: 'text',
      link: false
   },
   { id: 'name', label: 'Name', type: 'number', link: true },
   {
      id: 'magician',
      label: 'Magician',
      type: 'boolean',
      booleanRel: {
         trueField: {
            trueText: 'Yes!',
            cssClass: 'true-class'
         },
         falseText: 'Nope'
      },
      link: false,
   },
   {
      id: 'alive',
      label: 'AlIve',
      type: 'boolean',
      booleanRel: {
         trueText: 'Yep',
         falseField: {
            falseText: 'nein',
            cssClass: 'false-class'
         }
      },
      link: false,
   }
];

let heroesDatalist = heroes.map((hero) => new Hero(hero));
let componentRow: GosecListRowComponent<heroeInterface>;

describe(('st-list-row'), () => {

   let componentRow: GosecListRowComponent<heroeInterface>;

   beforeEach(() => {
      componentRow = new GosecListRowComponent<heroeInterface>();
      componentRow.metadata = heroesMetadata;
   });

   it('should emit openDetail event', (done) => {
      componentRow.rowData = heroesDatalist[0];
      componentRow.openDetail.subscribe((eventData: string) => {
         expect(eventData).toEqual('myId');
         done();
      });
      componentRow.showDetail('myId');
   });

});



