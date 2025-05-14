
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateHouseZoneDto   {

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;
}
