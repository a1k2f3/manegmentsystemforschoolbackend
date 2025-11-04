export class CreateJobApplicationDto {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address?: string;
  readonly position?: string;
  readonly gender?: string;
  readonly qualification?: string;
  readonly university?: string;
  readonly yearOfPassing?: string;
  readonly cgpa?: string;
  readonly lastJob?: string;
  readonly yearsOfExperience?: string;
  readonly skills?: string;
  // File paths (optional)
  readonly cv?: string;
  readonly degree?: string;
  readonly photo?: string;
}
