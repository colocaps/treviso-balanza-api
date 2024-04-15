import { Controller, Post, Body, HttpException, HttpStatus, Injectable, Get, Logger } from "@nestjs/common";
import { Supabase } from "src/common/supabase";
import { PersonService } from "src/person/person_service";
import { Person } from "./entity/person_entity";
import {  PersonDto } from "./dto/person_dto";
import { PersonTypeDto } from "./dto/person_type_dto";




@Controller('person')
export class PersonController {
    private readonly logger = new Logger(PersonController.name);
    constructor(private readonly supabase: Supabase,private readonly personService: PersonService) {}
  
  
    @Post()
    async insertPerson(@Body() personDto: PersonDto) {
      const client = this.supabase.getClient();
      try {
        await client.rpc('begin');
  
        const { name, cuit, phoneNumber, type } = personDto;
  
        // Insertar la persona en la tabla "juridic_person" de Supabase
        const { data: insertedPerson, error: errorPerson } = await client.from('juridic_person').insert([{ name, cuit, phoneNumber }]);
        if (errorPerson) {
          await client.rpc('rollback');
          throw new HttpException(`Error al insertar la persona: ${errorPerson.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  
        // Obtener el ID de la persona recién insertada
        const personId = insertedPerson[0].id;
  
        // Insertar los roles asociados a la persona en la tabla intermedia "person_type_intermediate"
        for (const roleId of type) {
          const { error: errorRelationship } = await client.from('person_type_intermediate').insert([{ juridic_person_id: personId, person_type_id: roleId }]);
          if (errorRelationship) {
            await client.rpc('rollback');
            throw new HttpException(`Error al insertar la relación para el rol con ID '${roleId}': ${errorRelationship.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
  
        await client.rpc('commit');
  
        return { message: 'Persona insertada correctamente con sus roles asociados.' };
      } catch (error) {
        throw new HttpException(`Error en la inserción: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
  }

  @Get()
  async getPersons(): Promise<PersonDto[]> {
    const persons: Person[] = await this.personService.getPersons();
    return persons.map(person => ({
      id: person.id,
      name: person.name,
      cuit: person.cuit,
      phoneNumber: person.phoneNumber
    })) as PersonDto[];
  }

  @Get('/type')
  async getPersonType(): Promise<PersonTypeDto[]> {
    const persons: PersonTypeDto[] = await this.personService.getTypePersons();
   return persons;
  }
}