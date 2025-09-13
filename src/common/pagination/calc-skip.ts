import { PageOptionsDto } from './page-option-dto';

export const calcSkip = (pageOptionsDto: PageOptionsDto): number => {
  return (pageOptionsDto.page - 1) * pageOptionsDto.take;
};
