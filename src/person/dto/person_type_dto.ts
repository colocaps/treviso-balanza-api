import {  IsInt, IsString } from 'class-validator';

export class PersonTypeDto {
  @IsInt()
  readonly id: number;
  
  @IsString()
  readonly description: string;

  
}