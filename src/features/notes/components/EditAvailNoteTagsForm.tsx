/* eslint-disable react/no-children-prop */

"use client";

// react
import { Fragment, useActionState, useEffect, useRef } from "react";

// server actions and mutations
import editAvailNoteTags from "@/features/notes/actions/editAvailNoteTagsForm";

// services, features, and other libraries
import { mergeForm, useTransform } from "@tanstack/react-form-nextjs";
import { useAppForm } from "@/components/form";
import { EditAvailNoteTagsFormSchema } from "@/features/notes/schemas/editAvailNoteTagsForm";
import useEditAvailNoteTagsFormFeedback from "@/features/notes/hooks/feedbacks/useEditAvailNoteTagsForm";

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Button } from "@/components/ui/custom/button";
import FieldErrors from "@/components/form/field-errors";
import InfoLine from "@/components/form/InfoLine";

// assets
import { PlusCircleIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline";

// types
import type { getAvailNoteTags } from "@/features/notes/db";

interface EditAvailNoteTagsFormProps {
  availNoteTags: Awaited<ReturnType<typeof getAvailNoteTags>>;
  inNoteModal?: boolean;
}

// constants
import { FORM_OPTIONS, INITIAL_FORM_STATE } from "@/features/notes/constants/editAvailNoteTagsForm";

export default function EditAvailNoteTagsForm({ availNoteTags, inNoteModal = false }: EditAvailNoteTagsFormProps) {
  // The main server action that processes the form
  const [formState, formAction, isPending] = useActionState(editAvailNoteTags, INITIAL_FORM_STATE);
  const { AppField, AppForm, FormSubmit, handleSubmit, store } = useAppForm({
    ...FORM_OPTIONS,
    defaultValues: { ...FORM_OPTIONS.defaultValues, availNoteTags },
    transform: useTransform((baseForm) => mergeForm(baseForm, formState), [formState]),
  });

  // Track if the user has pressed the submit button
  const hasPressedSubmitRef = useRef(false);

  // All this new cleanup code is for the <Activity /> boundary
  useEffect(() => {
    // Reset the flag when the component unmounts
    return () => {
      hasPressedSubmitRef.current = false;
    };
  }, []);

  // Provide feedback to the user regarding this form actions
  const { feedbackMessage, hideFeedbackMessage } = useEditAvailNoteTagsFormFeedback(hasPressedSubmitRef, formState, store);

  return (
    <AppForm>
      <form
        action={formAction}
        onSubmit={async () => {
          await handleSubmit();
          hasPressedSubmitRef.current = true;
        }}
      >
        <Card className="max-w-2xl">
          {!inNoteModal && (
            <CardHeader>
              <CardTitle>Note Tags</CardTitle>
              <CardDescription>To edit all your available note tags</CardDescription>
            </CardHeader>
          )}
          <CardContent>
            <AppField
              name="availNoteTags"
              mode="array"
              children={(field) => (
                <>
                  {field.state.value.map(({ id: noteTagId }, noteTagIndex) => (
                    <Fragment key={noteTagId}>
                      <input type="hidden" name={`availNoteTags[${noteTagIndex}].id`} value={noteTagId} />
                      <AppField
                        name={`availNoteTags[${noteTagIndex}].name`}
                        validators={{ onChange: EditAvailNoteTagsFormSchema.shape.availNoteTags.unwrap().shape.name }}
                        children={(subField) => (
                          <div className="flex items-center gap-3">
                            <div>
                              <subField.TextField
                                label={`Name of Note Tag #${String(noteTagIndex + 1).padStart(2, "0")}`}
                                size={40}
                                maxLength={51}
                                spellCheck={false}
                                autoComplete="off"
                                placeholder="e.g. ⭐Important, 🔥Quick Thoughts, 🧠Ideas"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={field.state.value.length === 1}
                              onClick={() => field.removeValue(noteTagIndex)}
                            >
                              <TrashIcon className="size-10" />
                            </Button>
                          </div>
                        )}
                      />
                    </Fragment>
                  ))}
                  <FieldErrors />
                  <Button type="button" variant="secondary" className="w-full" onClick={() => field.pushValue({ id: crypto.randomUUID(), name: "" })}>
                    <PlusCircleIcon className="size-9" />
                    New Note Tag
                  </Button>
                </>
              )}
            />
          </CardContent>
          <CardFooter>
            <InfoLine message={feedbackMessage} />
            <FormSubmit submitIcon={<TagIcon className="size-9" />} submitText="Update Note Tags" isPending={isPending} onClearedForm={hideFeedbackMessage} />
          </CardFooter>
        </Card>
      </form>
    </AppForm>
  );
}
