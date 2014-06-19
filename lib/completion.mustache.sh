{{!Forked from https://github.com/isaacs/npm/blob/v1.3.17/lib/utils/completion.sh}}
#!/bin/bash
###-begin-{{name}}-completion-###
#
# {{name}} command completion script
#
# Installation: {{name}} completion >> ~/.bashrc  (or ~/.zshrc)
# Or, maybe: {{name}} completion > /usr/local/etc/bash_completion.d/{{name}}
#

COMP_WORDBREAKS=${COMP_WORDBREAKS/=/}
COMP_WORDBREAKS=${COMP_WORDBREAKS/@/}
export COMP_WORDBREAKS

if type complete &>/dev/null; then
  _{{name}}_completion () {
    local si="$IFS"
    IFS=$'\n' COMPREPLY=($(COMP_CWORD="$COMP_CWORD" \
                           COMP_LINE="$COMP_LINE" \
                           COMP_POINT="$COMP_POINT" \
                           {{name}} completion -- "${COMP_WORDS[@]}" \
                           2>/dev/null)) || return $?
    IFS="$si"
  }
  complete -F _{{name}}_completion {{name}}
{{!DEV: We removed `compdef` due to issues with `zsh` (zsh 5.0.0 (x86_64-unknown-linux-gnu))}}
elif type compctl &>/dev/null; then
  _{{name}}_completion () {
    local cword line point words si
    read -Ac words
    read -cn cword
    let cword-=1
    read -l line
    read -ln point
    si="$IFS"
    IFS=$'\n' reply=($(COMP_CWORD="$cword" \
                       COMP_LINE="$line" \
                       COMP_POINT="$point" \
                       {{name}} completion -- "${words[@]}" \
                       2>/dev/null)) || return $?
    IFS="$si"
  }
  compctl -K _{{name}}_completion {{name}}
fi
###-end-{{name}}-completion-###
