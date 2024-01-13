import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Env, EnvVariable } from '../models';

export type EnvState = {
  global: EnvVariable[];
  local: Env[];
  selectedEnv?: string;
};

const initialState: EnvState = {
  global: [],
  local: [],
};

export const envSlice = createSlice({
  name: 'env',
  initialState,
  reducers: {
    /**
     *
     */
    setEnvState: (
      state: EnvState,
      action: PayloadAction<{
        envState: EnvState;
      }>
    ) => {
      const { envState } = action.payload;
      return { ...envState };
    },
    /**
     * Create New Variable (Global | Local)
     */
    addVariable: (
      state: EnvState,
      action: PayloadAction<{
        isGlobal: boolean;
        variable: EnvVariable;
        envName?: string;
      }>
    ) => {
      const { global, local } = state;
      const { isGlobal, variable, envName } = action.payload;

      const varExists = isGlobal
        ? global.find(({ name }) => name === variable.name)
        : local
            .find(({ name }) => name === envName)
            ?.variables.find(({ name }) => name === variable.name);

      if (isGlobal) {
        state.global = varExists
          ? global.map((globalVar) =>
              globalVar.name === varExists.name ? varExists : globalVar
            )
          : [...global, variable];
        return;
      }
      if (envName) {
        state.local = local.map((env) =>
          env.name === envName
            ? {
                ...env,
                variables: varExists
                  ? env.variables.map((localVar) =>
                      localVar.name === varExists.name ? varExists : localVar
                    )
                  : [...env.variables, variable],
              }
            : env
        );
      }
    },
    /**
     * Edit Certain Variable (Global | Local)
     */
    editVariable: (
      state: EnvState,
      action: PayloadAction<{
        isGlobal: boolean;
        oldVar: EnvVariable;
        newVar: EnvVariable;
        envName?: string;
      }>
    ) => {
      const { global, local } = state;
      const { isGlobal, oldVar, newVar, envName } = action.payload;

      if (isGlobal) {
        state.global = [
          ...global.filter(({ name }) => name !== oldVar.name),
          newVar,
        ];
      } else if (envName) {
        state.local = local.map((env) =>
          env.name !== envName
            ? env
            : {
                ...env,
                variables: env.variables.map((variable) =>
                  variable.name !== oldVar.name ? variable : newVar
                ),
              }
        );
      }
    },
    /**
     * Remove Certain Variable (Global | Local)
     */
    removeVariable: (
      state: EnvState,
      action: PayloadAction<{
        isGlobal: boolean;
        varName: string;
        envName?: string;
      }>
    ) => {
      const { global, local } = state;
      const { isGlobal, varName, envName } = action.payload;

      if (isGlobal) {
        state.global = global.filter(({ name }) => name !== varName);
        return;
      }

      if (envName) {
        state.local = local.map((env) =>
          env.name !== envName
            ? env
            : {
                ...env,
                variables: env.variables.filter(({ name }) => name !== varName),
              }
        );
      }
    },
    /**
     * Create New Environment
     */
    addEnv: (state: EnvState, action: PayloadAction<{ envName: string }>) => {
      const { local } = state;
      const { envName } = action.payload;

      if (local.find(({ name }) => name === envName)) return;

      state.local = [
        ...local,
        {
          name: envName,
          variables: [],
        },
      ];

      if (!state.selectedEnv) state.selectedEnv = envName;
    },
    /**
     * Edit Certain Environment
     */
    editEnv: (
      state: EnvState,
      action: PayloadAction<{ oldEnvName: string; newEnvName: string }>
    ) => {
      const { local } = state;
      const { oldEnvName, newEnvName } = action.payload;

      state.local = local.map((env) =>
        env.name !== oldEnvName
          ? env
          : {
              name: newEnvName,
              variables: env.variables,
            }
      );
    },
    /**
     * Remove Certain Environment
     */
    removeEnv: (
      state: EnvState,
      action: PayloadAction<{ envName: string }>
    ) => {
      const { local, selectedEnv } = state;
      const { envName } = action.payload;

      state.local = local.filter(({ name }) => name !== envName);

      if (envName === selectedEnv) state.selectedEnv = state.local[0]?.name;
    },
    /**
     * Select Certain Environment
     */
    selectEnv: (
      state: EnvState,
      action: PayloadAction<{ envName: string }>
    ) => {
      const { local } = state;
      const { envName } = action.payload;

      if (local.find(({ name }) => name === envName))
        state.selectedEnv = envName;
    },
  },
});

export const {
  setEnvState,
  addVariable,
  editVariable,
  removeVariable,
  addEnv,
  editEnv,
  removeEnv,
  selectEnv,
} = envSlice.actions;
export default envSlice.reducer;
