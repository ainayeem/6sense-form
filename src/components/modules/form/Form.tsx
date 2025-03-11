"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  newFields: z.array(
    z.object({
      value: z.string().min(1, "This field is required"),
      checked: z.boolean().refine((val) => val === true, "Checkbox must be checked"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const UploadInformationForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    newFields: [],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newFields: [],
    },
  });

  const {
    formState: { isSubmitting },
    control,
    handleSubmit,
    setValue,
  } = form;

  const {
    append: appendNewField,
    fields: newFields,
    remove: removeNewField,
  } = useFieldArray({
    control,
    name: "newFields",
  });

  const addNewField = () => {
    const newField = { value: "", checked: false };
    appendNewField(newField);
    setFormValues((prev) => ({
      newFields: [...prev.newFields, newField],
    }));
  };

  const onSubmit = async (data: FormValues) => {
    console.log("🚀 ~ Submitted Data:", data);
    setFormValues(data);
  };

  const handleChange = (index: number, value: string) => {
    const updatedFields = [...formValues.newFields];
    updatedFields[index] = { ...updatedFields[index], value };
    setFormValues({ newFields: updatedFields });
    setValue(`newFields.${index}.value`, value, { shouldValidate: true });
  };

  const handleRemoveField = (index: number) => {
    removeNewField(index);
    setFormValues((prev) => ({
      newFields: prev.newFields.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-10 transition-all duration-200 hover:shadow-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Update Information
          </h1>
          <p className="text-gray-500 mt-3 text-lg">Please provide your information below</p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800">Information Fields</h3>
                </div>
                <Button
                  onClick={addNewField}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Field
                </Button>
              </div>

              <AnimatePresence>
                <div className="space-y-4">
                  {newFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 items-center group"
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox className="data-[state=checked]:bg-primary data-[state=checked]:text-white transition-all duration-200" />
                      </div>
                      <FormField
                        control={control}
                        name={`newFields.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder={`Information field ${index + 1}`}
                                className="bg-gray-50/30 border-gray-200 focus:bg-white transition-all duration-200 h-11"
                              />
                            </FormControl>
                            <FormMessage className="text-sm text-rose-500 mt-1" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all duration-200"
                        onClick={() => handleRemoveField(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Information"
              )}
            </Button>
          </form>
        </Form>

        <AnimatePresence>
          {formValues.newFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 space-y-6"
            >
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-xl text-gray-800 mb-4">Submitted Information</h3>
                <div className="space-y-3">
                  {formValues.newFields.map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{field.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-50/50 text-center font-semibold text-gray-700">
                        Information Table
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formValues.newFields.map((field, index) => (
                      <TableRow key={index} className="hover:bg-gray-50/30 transition-colors">
                        <TableCell className="text-center py-4">{field.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadInformationForm;
