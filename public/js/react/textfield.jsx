/* global module, require */
// variant of UMD - see https://github.com/umdjs/umd/blob/master/returnExports.js

(function umdLoad(root, factory) {
	'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['react'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('react'));
    } else {
        // Browser globals (root is window)
        root.TextField = factory(root.React);
    }
}(this, function (React) {
	'use strict';

    var TextField = React.createClass({
        getInitialState: function () {
            return {
                errors: [],
                hints: [],
                processed: false, // validated and error state added if any
                hasFocus: false,
                hasText: false,
                value: ''
            };
        },
        getDefaultProps: function () {
            return {
                type: 'text',
                validators: [],
                helpers: [],
                value: ''
            };
        },
        componentWillMount: function () {
        	var propValue = this.props.value,
        		self = this;

        	// synchronize prop with state
        	(propValue !== undefined) && this.setState({ value : propValue });
        },
        componentDidMount: function () {
            var onReady = this.props.onReady,
            	node = this.refs.value.getDOMNode();

            (onReady !== undefined) && onReady(node);
        },
        componentWillReceiveProps: function (nextProps) {
            // this is to allow the text "value" to be a controlled component
            // (see http://facebook.github.io/react/docs/forms.html#controlled-components)
            // while still synchronizing against prop changes
            if (this.state.value !== undefined) {
                this.setState({ value: nextProps.value });
            }
        },
        onBlur: function () {
            this.setState({ hasFocus: false });
            this.process();
            this.sanitize();
        },
        onFocus: function () {
            this.setState({ hasFocus: true });
            this.onChange();
        },
        onChange: function () {
            var onChange = this.props.onChange, node = this.refs.value.getDOMNode();
            this.setState({
                hasText: (node.value.length > 0),
                value: (node.value)
            });
            onChange && onChange(node.value);
            this.hint();
        },
        process: function () {
            this.setState({ processed: true });
            return this.hint();
        },
        sanitize: function () {
            var node = this.refs.value.getDOMNode(),
                sanitizer = this.props.sanitizer,
                sanitizedValue;

            // if there are no errors, then try to sanitize the field if a santize function is provided.
            if (sanitizer && this.state.errors.length === 0) {
                sanitizedValue = sanitizer(node.value);
                if (sanitizedValue !== node.value) {
                    node.value = sanitizedValue;
                    this.onChange();
                }
            }
        },
        hint: function () {
            var hinted = {
                errors: [],
                hints: []
            };

            var value = this.refs.value.getDOMNode().value;
            this.props.validators.forEach(function(validator) {
                var result = validator(value);
                result && hinted.errors.push(result);
            });
            this.props.helpers.forEach(function(helper) {
                var result = helper(value);
                result && hinted.hints.push(result);
            });
            this.setState(hinted);
            return hinted;
        },
        reset: function () {
            var inputEl = this.refs.value.getDOMNode();
            if (!this.props.disabled) {
                inputEl.value = '';
                this.onChange();
                inputEl.focus();
            }
        },
        render: function () {
        	var props = this.props,
        		state = this.state;

            // determine some rendering toggles
            var inputType, tooltip, clearWidget;

            inputType = (props.type === 'password' ? 'password' : 'text');

            if (state.processed && state.errors.length > 0) {
                className += ' has-error';
            }

            // if the textfield has focus then if there are errors, the infoArray has the errors, otherwise it has the hints
            tooltip = (function(state) {
            	var containerClass, itemClass, infoArray;

	            if (state.hasFocus) {
	                if (state.processed && state.errors.length > 0) {
	                    containerClass = 'errors';
	                    itemClass = 'error-item';
	                    infoArray = state.errors;
	                } else if (state.hints.length > 0) {
	                    containerClass = 'hints';
	                    itemClass = 'hint-item';
	                    infoArray = state.hints;
	                }
	            }

	            return (state.hasFocus) ? <FieldInfo containerClass={containerClass} itemClass={itemClass} infoArray={infoArray} /> : null;
            }(state));

            // if the textfield has text, show the widget to clear the textfield
            // note: we don't check state.hasFocus because that should be controlled by CSS
            clearWidget = (state.value.length) > 0 ? <FieldWidget className="clear-input" label="&times;" onClick={this.reset} /> : null;
            

            return (
                <div className={props.className}>
                    <label htmlFor={props.id}>
                    	{props.label}
                    </label>
                    <input 
                    	type={inputType} 
                    	id={props.id || props.name} 
                    	name={props.name} 
                    	placeholder={props.placeholder || props.label} 
                    	onBlur={this.onBlur} 
                    	onFocus={this.onFocus} 
                    	ref="value" 
                    	onChange={this.onChange} 
                    	disabled={props.disabled}
                    	value={state.value} 
                    />
                    {clearWidget}
                    {tooltip}
                </div>
            );
        }
    });

    var FieldInfo = React.createClass({
        getDefaultProps: function () {
            return {
                containerClass: 'info',
                itemClass: 'info-item',
                infoArray: []
            };
        },
        render: function () {
            var self = this;
            var infoArray = self.props.infoArray;
            var items = infoArray.map(function(info) {
                return <li className={self.props.itemClass} dangerouslySetInnerHTML={{__html: info}}></li>;
            });

            if (items.length === 0) {
                return null;
            } else if (items.length === 1) {
                return (
                    <div className={this.props.containerClass}>
                        <span className={self.props.itemClass} dangerouslySetInnerHTML={{__html: infoArray[0]}}></span>
                    </div>
                );
            } else {
                return (
                    <div className={this.props.containerClass}>
                        <ul>
                            {items}
                        </ul>
                    </div>
                );
            }
        }
    });

    var FieldWidget = React.createClass({
        getDefaultProps: function () {
            return {
                className: '',
                label: ''
            };
        },
        onClick: function (e) {
            e.preventDefault();
            if (this.props.onClick) {
                this.props.onClick();
            }
        }, render: function () {
            return (
                <button tabIndex="-1" className={this.props.className} onClick={this.onClick}>{this.props.label}</button>
            );
        }
    });

    return TextField;

}));