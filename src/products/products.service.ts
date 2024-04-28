import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  // propiedad para manejar errores al crear && alls product
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // if (!createProductDto.slug) {
      //   createProductDto.slug = createProductDto.titulo
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '');
      // } else {
      //   createProductDto.slug = createProductDto.slug
      //     .toLowerCase()
      //     .replaceAll(' ', '_')
      //     .replaceAll("'", '');
      // }

      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product); // Guardar DB

      return product;
    } catch (error) {
      this.handleErrorExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // QueryBuilder para buscar por el slug y por el titulo
      const queryBuider = this.productRepository.createQueryBuilder();

      product = await queryBuider
        .where(`UPPER(titulo) =:titulo or slug =:slug`, {
          titulo: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Producto con el id ${term} no encontrado!`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Buscate un product por el id, cargate todas las propiedades que esten en updateProductDto pueden ser toda o ninguna porque todas son opcionales, pero siempre voy a tener el id

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Producto con el id ${id} no encontrado`);

    // Si lo actualizo y el nombre ya existe
    try {
      // Guardarlo en DB
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleErrorExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Metodo para manejar errores
  private handleErrorExceptions(error: any) {
    // console.log(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    ); // lo q ve el user
  }
}
