import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private roomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async findUserRooms(userId: number): Promise<ChatRoom[]> {
    return this.roomRepository
      .createQueryBuilder('room')
      .where(':userId = ANY(room.participantIds)', { userId })
      .getMany();
  }

  async sendMessage(
    sendMessageDto: SendMessageDto,
    senderId: number,
  ): Promise<ChatMessage> {
    const message = this.messageRepository.create({
      ...sendMessageDto,
      senderId,
    });
    const saved = await this.messageRepository.save(message);
    // Always return with sender relation populated
    const found = await this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['sender'],
    });
    if (!found) {
      throw new Error('Message not found after save');
    }
    return found;
  }

  async getRoomMessages(roomId: number): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
  }
}
