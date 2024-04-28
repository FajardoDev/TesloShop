import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  titulo: string;

  @Column('float', {
    default: 0,
  })
  precio: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  disponible: number;

  @Column('text', {
    array: true,
  })
  tallas: string[];

  @Column('text')
  genero: string;

  @Column('text', {
    array: true,
    default: [],
  })
  etiquetas: string[];

  //   images
  //! Validar slug
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.titulo;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  // Actualizar Si lo actualizo y el nombre ya existe validar antes de q llegue DB
  @BeforeUpdate()
  checkSlugUpdate() {
    if (this.slug) {
      this.slug = this.titulo;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
