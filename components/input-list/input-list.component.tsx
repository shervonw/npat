import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from 'react-hook-form';
import { useGetUsersInRoom } from "../../hooks/waiting-room/get-users-in-room.hook";

import { useReducerContext } from "../../context/game.context";

export const InputList: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [state, dispatch] = useReducerContext();

  const { handleSubmit, register } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {}
  });

  const { categories } = state;

  const onSubmitHanlder = useCallback(async (formData: FormData) => {
    try {
      dispatch({ type: "ADD_ANSWERS", value: { currentRoom: props.context.round, answers: formData } })
      props.send({ type: "NEXT" }) 
    } catch (error) {
      console.log({ error })
    }
  }, [dispatch, props]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitHanlder)}>

        {categories.map((category: any, index: number) => (
          <div key={index}>
            <input
              {...register(category, { required: true, maxLength: 150 })}
              placeholder={category}
            />
          </div>
        ))}

        <button type="submit">
          Ready
        </button>
      </form>
    </div>
  );
}