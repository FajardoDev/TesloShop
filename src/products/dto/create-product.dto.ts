import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  titulo: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  disponible?: number;

  @IsString({ each: true })
  @IsArray()
  tallas: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  genero: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  etiquetas: string[];
}
