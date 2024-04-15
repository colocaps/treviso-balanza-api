import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class PersonDto {
  @IsInt()
  readonly id: number;
  
  @ApiProperty({ example: 'Metales Treviso', description: 'The name of the person' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: '30709111031', description: 'The cuit of the person' })
  @IsString()
  readonly cuit: string;

  @ApiProperty({
    example: '3513276895',
    description: 'The phone number of the Person',
  })
  @IsString()
  readonly  phoneNumber: string;

  @ApiProperty({
    example: [1,2],
    description: 'The person type, can be 1 or 2, or both',
  })
  @IsArray()
  @IsInt({ each: true }) 
  readonly type: number[];
  
}