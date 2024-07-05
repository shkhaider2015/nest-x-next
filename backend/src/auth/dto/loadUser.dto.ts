import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoadUserDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    refreshToken: string;
}