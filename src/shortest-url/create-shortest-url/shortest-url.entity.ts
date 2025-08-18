import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, ObjectId } from 'mongoose';

@Schema({ collection: 'shortest_urls', timestamps: true })
export class ShortestUrlEntity {
  _id: ObjectId;

  @Prop()
  key: string;

  @Prop()
  originalUrl: string;

  @Prop()
  visitCount: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export type ShortestUrlDocument = HydratedDocument<ShortestUrlEntity>;
export const ShortestUrlSchema =
  SchemaFactory.createForClass(ShortestUrlEntity);
