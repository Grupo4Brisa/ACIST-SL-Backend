export class CreateTaskDto {
  title!: string;

  description!: string;

  assignedTo!: number;

  dueDate!: Date;
}
