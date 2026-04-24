/* eslint-disable @typescript-eslint/no-explicit-any */

// services, features, and other libraries
import { Result, useAtomValue } from "@effect-atom/atom-react";
import { ParseError } from "effect/ParseResult";
import { BetterAuthApiError, UnauthorizedAccessError } from "@/lib/errors";

// components
import { InfoLine } from "./InfoLine";

// types
import type { Field } from "@lucas-barake/effect-form-react";
import type { BuiltForm } from "@lucas-barake/effect-form-react/FormReact";

interface SubmitStatusProps<TFields extends Field.FieldsRecord, R, A, E, SubmitArgs> {
  form: BuiltForm<TFields, R, A, E, SubmitArgs>;
  formName: string;
  succeededDesc: string;
  failedDesc?: string;
}

export function SubmitStatus<TFields extends Field.FieldsRecord, R, A, E, SubmitArgs>({
  form,
  formName,
  succeededDesc,
  failedDesc,
}: SubmitStatusProps<TFields, R, A, E, SubmitArgs>) {
  const submitResult = useAtomValue(form.submit);

  // Show the permanent feedback message as well
  return (Result.builder(submitResult) as any)
    .onWaiting(() => null)
    .onSuccess(() => <InfoLine message={`SUCCESS! → ${succeededDesc}`} />)
    .onError((error: unknown) =>
      error instanceof ParseError ? (
        <InfoLine message={`MISSING FIELDS! → Please correct the ${formName} form fields and try again.`} />
      ) : error instanceof BetterAuthApiError ? (
        <InfoLine message={`AUTHORIZATION ERROR! → Something went wrong; please try again later. → ${error.message}`} />
      ) : error instanceof UnauthorizedAccessError ? (
        <InfoLine message="DEMO MODE! → This action is disabled in demo mode." />
      ) : null
    )
    .onDefect(() => <InfoLine message={`SERVER ERROR!" → ${failedDesc ?? `The ${formName} form was not submitted successfully; please try again later.`}`} />)
    .orNull();
}
