import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    void this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.eProduct.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset, limit, orderPrice } = paginationDto;

    const totalPages = await this.eProduct.count({
      where: { available: true },
    });
    const lastPages = Math.ceil(offset / limit);

    return {
      data: await this.eProduct.findMany({
        skip: (offset - 1) * limit,
        take: limit,
        orderBy: {
          price: orderPrice,
        },
        where: {
          available: true,
        },
      }),
      meta: {
        total: totalPages,
        page: offset,
        lastPage: lastPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.eProduct.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Not Found products ${id}`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.eProduct.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.eProduct.update({
      where: { id },
      data: { available: false },
    });

    return product;
  }
}
