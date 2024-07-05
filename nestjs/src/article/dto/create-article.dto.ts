import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, MaxLength,
    MinLength, IsBoolean } from "class-validator";

export class CreateArticleDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(300)
    @ApiProperty({ required: true })
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    body: string


    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    published?: boolean = false
}
