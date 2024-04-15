import { ApiProperty } from "@nestjs/swagger";

export class Person {
    id: number;
 
     @ApiProperty({ example: 'Metales Treviso', description: 'The name of the person' })
    name: string;
  
    @ApiProperty({ example: '30709111031', description: 'The cuit of the person' })
    cuit: string;
  
    @ApiProperty({
      example: '3513276895',
      description: 'The phone number of the Person',
    })
    phoneNumber: string;

    @ApiProperty({
        example: ['1 para Cliente', '2 para proveedor', 'pueden ser ambos'],
        description: 'The person type',
      })
      type: number[]

  }

