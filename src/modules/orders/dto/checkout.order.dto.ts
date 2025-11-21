import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class OrderIdDTO{
  @ApiProperty({ type: Types.ObjectId })

    @IsMongoId()
    orderId:Types.ObjectId
}