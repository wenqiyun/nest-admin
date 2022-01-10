import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostEntity } from './post.entity'
import { PostService } from './post.service'
import { PostController } from './post.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
