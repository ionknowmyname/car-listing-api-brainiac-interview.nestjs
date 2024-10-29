import { User } from "../schema/user.schema";

export class UserDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;

  getEntity() {
    const entity = new User();
    entity.fullName = this.fullName;
    entity.email = this.email;
    entity.phoneNumber = this.phoneNumber;
    return entity;
  }
}

export function createFromEntity(entity: User): UserDto {
  const dto = new UserDto();
  dto.id = entity._id.toString();
  dto.fullName = entity.fullName;
  dto.email = entity.email;
  dto.phoneNumber = entity.phoneNumber;
  return dto;
}

export type CreateUser = Pick<UserDto, 'fullName' | 'email' | 'phoneNumber'>;
