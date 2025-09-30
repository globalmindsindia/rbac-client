export type CreateRoleInput = {
  name: string;
  description?: string;
};

export type UpdateRoleInput = {
  name?: string;
  description?: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
  userCount: number;
};

type BaseProps = {
  trigger: React.ReactNode;
};

export type AddProps = BaseProps & {
  mode: "add";
  onSubmit: (data: CreateRoleInput) => Promise<void>;
  initialValues?: Partial<CreateRoleInput> & { permissions?: string[] };
};

export type EditProps = BaseProps & {
  mode: "edit";
  role: Role; // required only in edit mode
  onSubmit: (data: UpdateRoleInput) => Promise<void>;
};

export type RoleFormProps = AddProps | EditProps;
