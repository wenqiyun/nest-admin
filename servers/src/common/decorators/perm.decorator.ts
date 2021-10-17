import { SetMetadata } from '@nestjs/common'

import { IPermDecorator } from './perm-decorator.interface';

export const Perm = (permission?: IPermDecorator | boolean) => SetMetadata('perm', permission)
