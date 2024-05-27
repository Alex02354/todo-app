"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  listId: z.string(),
  title: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
    } catch (error) {
      setError("root", {
        message: "This email is already taken",
      });
    }
  };

  return (
    <form className="tutorial gap-2" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("listId")} type="number" placeholder="listId" />
      {errors.listId && (
        <div className="text-red-500">{errors.listId.message}</div>
      )}
      <input {...register("title")} type="password" placeholder="Title" />
      {errors.title && (
        <div className="text-red-500">{errors.title.message}</div>
      )}
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </form>
  );
};

export default Form;
