import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Supabase } from 'src/common/supabase';
import { PersonDto } from './dto/person_dto';
import { PersonTypeDto } from './dto/person_type_dto';



@Injectable()
export class PersonService {
  constructor(private readonly supabase: Supabase) {}

  async getPersons(): Promise<PersonDto[]> {
   try {
     const { data:persons, error } = await this.supabase
       .getClient()
       .from<PersonDto>('juridic_person')
       .select();
 
     if (error) {
       throw new InternalServerErrorException(error.message);
     }
 
     return persons;
   } catch (error) {
    throw new HttpException(`Error en la consulta: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

   }
  }
  async insertPersons(): Promise<PersonDto[]> {
    const { data:persons, error } = await this.supabase
      .getClient()
      .from<PersonDto>('juridic_person')
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return persons;
  }
  async getTypePersons(): Promise<PersonTypeDto[]> {
    const { data:personType, error } = await this.supabase
      .getClient()
      .from<PersonTypeDto>('person_type')
      .select();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return personType;
  }

  
}
