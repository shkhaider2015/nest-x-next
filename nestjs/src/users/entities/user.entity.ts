import { ApiProperty } from "@nestjs/swagger";
import { $Enums, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {

    constructor(partial:Partial<UserEntity>) {
        Object.assign(this, partial)
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    activated: boolean;

    @ApiProperty()
    role: $Enums.Role;

    // Not to expose to swagger
    @Exclude()
    password: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
